import { useEffect, useState } from "react";
import "./tabBar.css"
import { Link } from "@remix-run/react";

interface tabItem {
    title: string;
    link?: string;
    onClick?: () => void;
    tabindex?: number;
    position?: "left" | "right";
}

interface TabBarProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    tabs: tabItem[];
    activeIndex?: number;
    onTabChange: (index: number) => void;
}

export default function TabBar({
    style, tabs, onTabChange, activeIndex
}: TabBarProps) {
    const [useMobile, setUseMobile] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 768) setUseMobile(true);
        else setUseMobile(false);
    }, []);

    return (
        <div className="tab-bar" style={style}>
            {
                !useMobile &&
                    <div className="left">
                        {
                            tabs.map((tab, index) => (
                                <Link key={index} to={tab.link || ""}>
                                    <div key={index} className={`tab ${activeIndex === index ? "active" : ""}`} onClick={() => {
                                        if (tab.onClick) tab.onClick();
                                        onTabChange(index);
                                    }}>
                                        {tab.title}
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
            }
            {
                useMobile &&
                    <div className="mobile">
                        <select>
                            {
                                tabs.map((tab, index) => (
                                    <option key={index} value={index} onClick={() => {
                                        if (tab.onClick) tab.onClick();
                                        if (tab.link) window.location.href = tab.link;
                                        onTabChange(index);
                                    }}
                                    selected={activeIndex === index ? true : false}
                                    >
                                        {tab.title}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
            }
            {/* <div className="right">
                {
                    tabs.filter(tab => tab.position === "right").map((tab, index) => (
                        <Link key={index} to={tab.link || ""}>
                            <div key={index} className={`tab ${activeTab === index ? "active" : ""}`} onClick={() => {
                                if (tab.onClick) tab.onClick();
                                setActiveTab(index);
                            }}>
                                {tab.title}
                            </div>
                        </Link>
                    ))
                }
            </div> */}
        </div>
    );
}