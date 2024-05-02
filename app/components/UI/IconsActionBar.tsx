import "./IconsActionBar.css"
import Icon, { svgIcons } from "../icons";
import { useEffect, useState } from "react";

interface IconsActionBarProps {
  actions: {
    icon?: keyof typeof svgIcons;
    text?: string;
    onClick: () => void;
    title?: string;
    active?: boolean;
  }[];
  clickBehavior?: "toggle" | "single";
  onToggle?: (index: number) => void;
  onSingleClick?: (index: number) => void;
} 

interface ActiveButtonProps {
  buttonIndex: number;
  active?: boolean;
}

export const ActionBar = ({ actions, clickBehavior }: IconsActionBarProps) => {
  const [activeIndex, setActiveIndex] = useState<number | number[] | null>(null);

  useEffect(() => {
    // check if there is an active button
    const active = actions.findIndex((action) => action.active);
    if (active !== -1) setActiveIndex(active);
  }, []);

  const handleClick = (btn: ActiveButtonProps) => {
    if (!clickBehavior) return;
    if (clickBehavior === "toggle") {
      const newActive = activeIndex === btn.buttonIndex ? null : btn.buttonIndex;
      setActiveIndex(newActive);
      return;
    }
    if (clickBehavior === "single") {
      setActiveIndex(btn.buttonIndex);
      return;
    }
  };

  return (
    <div className={`icons-action-bar ${!clickBehavior ? "no-behavior" : ""}`}>
      <div className="flex">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`icon-button ${activeIndex === index ? "active" : ""}`}
            onClick={() => {
              handleClick({ buttonIndex: index, active: action.active });
              action.onClick();
            }}
          >
            {
              action.icon && (
                <Icon name={action.icon} />
              )
            }
            {
              action.text && (
                <span>{action.text}</span>
              )
            }
          </button>
        ))}
      </div>
    </div>
  );
};
