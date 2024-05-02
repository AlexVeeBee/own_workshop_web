import React, { useRef } from "react";
import { useState, useEffect } from "react";
import "./UserHeader.css";
import LoadingCircle from "../LoadingCircle";
import { IUser } from "~/utils/types";

interface UserHeaderProps {
  user: IUser;
  style?: React.CSSProperties;
  constaints?: constaints;
  // prefix and suffix react elements
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
  avatarid?: number | null;
  colortransparensy?: number;
}

/**
 * @interface restains
 * NOTE: This does use the React.CSSProperties type
 * @param {number | string} maxWidth - max width of the avatar
 * @param {number | string} maxHeight - max height of the avatar
 */
interface constaints {
  // max width - default 100%
  maxWidth?: number | string;
  // max height
  maxHeight?: number | string;
}

// /**
//   * @interface UserHeaderProps
//   * @param {IUser} user - user object
//   *                               (if true, user prop is ignored)
//   * @param {React.CSSProperties} style - style of the user header
//   * @param {constaints} constaints - constaints of the avatar
//   * @param {React.ReactNode | string} prefix - prefix react element
//   * @param {React.ReactNode | string} suffix - suffix react element
//   * @param {number | null} avatarid - avatar id
//   * @param {(color: string) => void} onAvrgBkgColorChange - callback for when the avrage background color changes
//   * @param {React.ReactNode} children - children react node
//   */
const UserHeader = ({
  user, prefix, suffix,
  constaints = {
    maxWidth: "var(--page-width)",
    maxHeight: "100%"
  },
  style = {},
  colortransparensy = 1,
  ...props
}: UserHeaderProps) => {
  const [avrageimagecolor, setAvrageimagecolor] = useState("#222");
  const [avrageimagecolorAlt, setAvrageimagecolorAlt] = useState("#333");
  const [nameWhite, setNameWhite] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const imgref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgref.current && user.pfp) {
      var img = new Image();
      img.src = user.pfp;
      img.onload = function () {
        var rgb = getAverageRGB(img); 
        const white = (rgb.r + rgb.g + rgb.b < 552)
        setNameWhite(white);
        setAvrageimagecolor(`rgba(${rgb.r},${rgb.g},${rgb.b})`);
        setAvrageimagecolorAlt(`rgba(${rgb.r + (white ? 50 : -50)},${rgb.g + (white ? 50 : -50)},${rgb.b + (white ? 50 : -50)})`);
      };
    } else {
      console.log("Avatar url is empty");
    }
  }, [imgref, user.pfp]);
  useEffect(() => {
    if (imgref.current) {
      imgref.current.loading = "eager";
      imgref.current.onload = function () {
        setAvatarLoading(false);
      };
      if (imgref.current.complete) {
        setAvatarLoading(false);
      }
    }

    return () => {
      if (imgref.current) {
        imgref.current.onload = null;
      }
    };
  }, [imgref]);

  return (
    <div className="user-header" style={{ 
      // @ts-ignore
      "--avatar-color": avrageimagecolor,
      // @ts-ignore
      "--avatar-color-lighter": avrageimagecolorAlt,
    }}>
      {
        prefix ? <div className="prefix"> {prefix} </div> : null
      }
      <div className={"avatar" + (nameWhite ? " white" : "")} style={constaints} >
        <div className="avatar-main">
          <div className="pfp">
            <img 
              className="noselect icon"
              alt="User avatar"
              ref={imgref}
              src={user.pfp}
            /> 
            {avatarLoading ? (
              <div className="loading">
                <LoadingCircle />
              </div>
            ) : null}
          </div>
          <div className="front">
            <h1 className={"username"}>{user.username}</h1>
          </div>
        </div>
        <div className="suffix">
          {suffix}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;

function getAverageRGB(img: HTMLImageElement) {
  img.crossOrigin = "Anonymous";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const width = (canvas.width = img.width);
  const height = (canvas.height = img.height);

  context?.drawImage(img, 0, 0);

  const data = context?.getImageData(0, 0, width, height).data || [];

  const rgb = { r: 0, g: 0, b: 0 };

  let count = 0;

  for (var i = 0; i < data.length; i += 4) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];

    if (r === 0 && g === 0 && b === 0) {
      continue;
    }

    rgb.r += r;
    rgb.g += g;
    rgb.b += b;

    count++;
  }

  rgb.r = Math.floor(rgb.r / count);
  rgb.g = Math.floor(rgb.g / count);
  rgb.b = Math.floor(rgb.b / count);

  return rgb;
}