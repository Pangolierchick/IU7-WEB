"use client";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";
import style from "./navbar.module.css";

const Navbar = () => {
  const [isLogged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(getCookie("token") !== undefined);
  });

  if (!isLogged) {
    return (
      <div className={style.navbar}>
        <div className={style.bbrLogo}>
          <Link style={{ textDecoration: "none", color: "#116a7b" }} href="/">
            B&BR
          </Link>
        </div>
        <div className={style.marginLeft}>
          <Link
            style={{ textDecoration: "none", color: "#000000" }}
            href="/signup"
          >
            Регистрация
          </Link>
        </div>
        <div>
          <Link
            style={{ textDecoration: "none", color: "#000000" }}
            href="/login"
          >
            Войти
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className={style.navbar}>
        <div className={style.bbrLogo}>
          <Link style={{ textDecoration: "none", color: "#116a7b" }} href="/">
            B&BR
          </Link>
        </div>
        <div className={style.marginLeft}>
          <Link
            style={{ textDecoration: "none", color: "#000000" }}
            href="/signup"
          >
            Добавить объявление
          </Link>
        </div>
        <div>
          <Link
            style={{ textDecoration: "none", color: "#000000" }}
            href="/signup"
          >
            Профиль
          </Link>
        </div>
        <div
          onClick={(e) => {
            deleteCookie("token");
            setLogged(false);
          }}
        >
          <Link style={{ textDecoration: "none", color: "#000000" }} href="/">
            Выйти
          </Link>
        </div>
      </div>
    );
  }
};

export default Navbar;
