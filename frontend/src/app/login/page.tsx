"use client";
import { auth } from "@/services/auth";
import { Box, Button, TextField } from "@mui/material";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();
    auth(login, password)
      .then((d) => {
        console.log(d);
        setCookie("token", d, { secure: true });
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        position: "absolute",
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "12px",
        boxShadow: "-1px 1px 10px 0px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 4,
          gap: 2,
        }}
      >
        <TextField
          label="Логин"
          onChange={(e) => setLogin(e.target.value)}
        ></TextField>
        <TextField
          label="Пароль"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ backgroundColor: "#116a7b", borderRadius: "12px" }}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  );
}
