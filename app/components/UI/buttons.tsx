import "./buttons.css";

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

enum ButtonTypes {
    PRIMARY = "btn-primary",
    SECONDARY = "btn-secondary",
    DANGER = "btn-danger",
    WARNING = "btn-warning",
    INFO = "btn-info",
    SUCCESS = "btn-success"
}

const Button = (
    { onClick, children, style, className, btnType }: 
    ButtonProps & {
        btnType?: keyof typeof ButtonTypes
    }) => {
    return <button 
        className={`btn ${className} ${btnType ? ButtonTypes[btnType] : ""}`}
        style={style}
        onClick={onClick}
    >
        {children}
    </button>
}

const LiminalButton = (
    { onClick, children, style, className }: 
    ButtonProps ) => {
    return <button 
        className={`btn-liminal ${className}`}
        style={style}
        onClick={onClick}
    >
        {children}
    </button>
}


export default Button;

const Buttons = {
    Button,
    LiminalButton
}
export { Buttons }

