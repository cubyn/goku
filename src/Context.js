/**
 * Describes current serialization context
 */
export default class Context {
    constructor(groups = [], depth = 0) {
        this.groups = groups;
        this.depth = depth;
    }
    incrDepthClone() {
        return new Context(this.groups, this.depth + 1);
    }
}
