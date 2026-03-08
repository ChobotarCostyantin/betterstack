export class SoftwareMarkedUsedEvent {
    static readonly eventName = 'software.marked_used';

    constructor(
        public readonly userId: number,
        public readonly softwareId: number,
    ) {}
}

export class SoftwareMarkedUnusedEvent {
    static readonly eventName = 'software.marked_unused';

    constructor(
        public readonly userId: number,
        public readonly softwareId: number,
    ) {}
}
