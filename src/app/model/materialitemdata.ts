export class MaterialItemData {
    have = 0;
    need = 0;
    lack = 0;
    canMerge = false;

    name: string;
    constructor(name: string) {
        this.name = name;
    }
    shouldHide() {
        return !(this.have || this.need || this.lack);
    }
}
