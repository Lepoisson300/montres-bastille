import { Link } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";


interface btn_interface{
    text: string;
    redirection?:string|"";
    style:"full"|"bordered"|"base";
    size: {px:number, py:number}
}

export default function BtnRedirection ({text,style, redirection, size}:btn_interface){

    const styles = {
        full: "bg-primary text-dark font-sans text-sm uppercase shadow-md hover:bg-primary-dark hover:shadow-lg",
        bordered: " border border-primary text-sm  font-sans uppercase text-primary hover:bg-primary hover:text-dark hover:shadow-lg",
        base: "...",
        };
    return (
        <Link
            to={redirection}
            style={{ paddingLeft: `${size.px * 0.25}rem`, paddingRight: `${size.px * 0.25}rem`, paddingTop: `${size.py * 0.25}rem`, paddingBottom: `${size.py * 0.25}rem` }}
            className={`inline-flex items-center tracking-[0.2em] gap-2 rounded-full transition-all duration-300 ${styles[style]}`}
            >
            <GoArrowUpRight />
            {text}
        </Link>
    );
    
}