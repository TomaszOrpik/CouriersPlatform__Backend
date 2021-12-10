import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { GetDirectionsResponseModel } from '../models/getDirectionsResponse.model';
import { Direction } from '../models/direction.model';
import { Position } from '../models/position.model';
import { PositionWithDistance } from '../models/positionWithDistance.model';



@Injectable()
export class RouteService {
  endpoint = `${process.env.OSRM_ENDPOINT}`;

  constructor(private httpService: HttpService) { }

  async getDirections(initPosition: Position, route: Position[])
    : Promise<GetDirectionsResponseModel> {
    let url = `${this.endpoint}/route/v1/driving/`;
    url = url.concat(`${initPosition.longitude},${initPosition.latitude};`);
    route.forEach((position: Position) => {
      url = url.concat(`${position.longitude},${position.latitude};`);
    });
    url = url.replace(/.$/, "?overview=full&alternatives=true&steps=true");
    try {
      let maxDistance: number = 0;
      let maxTime: number = 0;
      let positionsToCountIn = [...route];
      const positionsWithDistance: PositionWithDistance[] = [];
      const response = await lastValueFrom(this.httpService.get(url));
      const directions: Direction[] = [];
      response.data.routes[0].legs.forEach((leg: any) => {
        leg.steps.forEach((step: any) => {
          directions.push({
            distance: step.distance,
            duration: step.duration,
            modifier: step.maneuver.modifier,
            type: step.maneuver.type,
            name: step.name
          });
        });
      });
      directions.forEach((d: Direction) => {
        maxDistance = maxDistance + d.distance;
        maxTime = maxTime + d.duration;
        if (d.type === 'arrive') {
          positionsWithDistance.push({
            position: positionsToCountIn[0],
            distance: maxDistance,
            time: maxTime
          });
          positionsToCountIn.shift();
        }
      });
      return {
        directions: directions,
        positionsWithDistance: positionsWithDistance
      };
    }
    catch (e) {
      console.log(e);
      return {
        directions: [],
        positionsWithDistance: []
      };
    }
  }

  async getOrder(
    initPosition: Position,
    route: Position[],
  ): Promise<Position[]> {
    const orderedPositions = [];
    let copyOfRoute = [...route];
    const lengthOfRoute = Array.from(route);

    for (const el of lengthOfRoute) {
      const closestPoint = await this.getClosesPosition(
        initPosition,
        copyOfRoute,
      );
      copyOfRoute = copyOfRoute.filter((p) => p !== closestPoint);
      orderedPositions.push(closestPoint);
    }
    return orderedPositions;
  }

  async getClosesPosition(
    init: Position,
    route: Position[],
  ): Promise<Position> {
    const positionsWithDistance: { position: Position; distance: number }[] =
      [];
    await Promise.all(
      route.map(async (p) => {
        positionsWithDistance.push({
          position: p,
          distance: await this.getDistance(init, p),
        });
      }),
    );
    positionsWithDistance.sort((a, b) => a.distance - b.distance);
    return positionsWithDistance[0].position;
  }

  async getDistance(a: Position, b: Position): Promise<number> {
    ///url have 1 second per request limit
    const url = `${this.endpoint}/route/v1/driving/${a.longitude},${a.latitude};${b.longitude},${b.latitude}?overview=false`;
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data.routes[0].distance;
    }
    catch (e) {
      console.log(e);
      return 0;
    }
  }
}
