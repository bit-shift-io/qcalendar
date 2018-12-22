 
export default class Rect {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    isPointInside(x, y) {
        if (x >= this.x && x <= (this.x + this.width)
            && y >= this.y && y <= (this.y + this.height))
            return true;

        return false;
    }
}