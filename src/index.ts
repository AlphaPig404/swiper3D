import EventEmitter from 'eventemitter3';
import { Options } from './type';
import './css/index.scss';

const defaultOpitons:Options = {
    showNum: 5,
    start: 0,
    loops: false
}

class Swiper3D extends EventEmitter{
    private options: Options
    private $swiper: HTMLElement
    private slides: NodeListOf<Element>
    private styleList: string[] = []
    private currentIndex: number = 0

    constructor(container: string|HTMLElement, options: Options){
        super()
        this.options = {...options, ...defaultOpitons}
        this.$swiper = typeof container === 'string' ? document.querySelector(container) : container 
      
        this.slides = this.$swiper.querySelectorAll('.swiper-slide')
        this.checkOptions(this.options)
        
        this.init()
    }

    private init(){
        // .swiper-slide0{
        //     background: red;
        //     transform: translateX(-75%) rotateY($deg) scale(0.64);
        //     z-index: -2;
        // }
        // .swiper-slide1{
        //     background: orange;
        //     transform: translateX(-50%) rotateY($deg) scale(0.8);
        //     z-index: -1;
        // }
        // .swiper-slide2{
        //     background: yellow;
        //     z-index: 0;
        // }
        // .swiper-slide3{
        //     background: green;
        //     transform: translateX(50%) rotateY(-$deg) scale(0.8);
        //     z-index: -1;
    
        // }
        // .swiper-slide4{
        //     background: blue;
        //     transform: translateX(75%) rotateY(-$deg) scale(0.64);
        //     z-index: -2;
        // }
        this.currentIndex = this.options.start
        const middleIndex = Math.floor(this.slides.length / 2)
        this.forEach(this.slides, (slide: HTMLElement, index) => {
            const SCALE_BASE = 0.8
            const ROTATE = 60

            const showIndex = index - middleIndex
            const sign = Math.sign(showIndex)
            const absShowIndex = Math.abs(showIndex)

            const translateX: number = (1 - 1/Math.pow(2, absShowIndex))*sign
            const rotateY: number = showIndex ? -sign*ROTATE : 0
            const scale:number = Math.pow(SCALE_BASE*sign, absShowIndex)
            const zIndex = showIndex
           
            const cssText = `
                transition: all 0.3s ease;
                transform: translateX(${translateX*100}%) rotateY(${rotateY}deg) scale(${scale});
                z-index: ${zIndex};
            `
            slide.style.cssText = cssText
            this.styleList.push(cssText)
        })
    }

    public prev() {
        
    }

    public next(){

    }

    public jump(){

    }

    private forEach(list: ArrayLike<any>, cb: (item: any, index: number) => void){
        for(let i = 0; i < list.length; i++){
          cb(list[i], i)
        }
    }

    private checkOptions(options: Options){
        if(!(options.showNum % 2 || options.showNum < 3)){
            throw Error('showNum must be odd number >= 3')
        }
        if(options.start < 0 || options.start > this.slides.length - 1){
            throw Error(`start cross the border, must in [0, ${this.slides.length})`)
        }
        return true
    }
}

declare global {
    interface Window { Swiper3D: any; }
}

window.Swiper3D = Swiper3D;
