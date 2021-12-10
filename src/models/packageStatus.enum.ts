export enum PackageStatus {
    failed = 'Niedostarczona',
    waiting = 'Oczekująca', ///w dystrybucji
    assigned = 'Wydana do dostarczenia', ///jest u kuriera
    inProgress = 'W trakcie dostarczania', ///jest u kuriera jako obecnie dostarczana
    delivered = 'Dostarczona',
}