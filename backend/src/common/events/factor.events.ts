export class FactorDeletedEvent {
    static readonly eventName = 'factor.deleted';

    constructor(public readonly factorId: number) {}
}
