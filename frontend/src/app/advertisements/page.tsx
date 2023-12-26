"use client";
import { postAdvertisement } from "@/services/advertisements";
import { isLogged } from "@/services/auth";
import { Alert, AlertTitle, Box, Button, TextField } from "@mui/material";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./page.module.css";

export default function CreateAdvertisementPage() {
  const [logged, setLogged] = useState(false);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [cost, setCost] = useState(0);
  const [description, setDescription] = useState("");

  const [costError, setCostError] = useState("");

  const [showAllert, setShowAllert] = useState("");

  const router = useRouter();

  useEffect(() => {
    setLogged(isLogged());
  });

  const validateFields = () => {
    if (cost <= 0) {
      setCostError("Цена должна быть положительной");
      return false;
    } else {
      setCostError("");
    }

    return true;
  };

  const handleAddAdv = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields()) {
      const token = getCookie("token");
      if (token) {
        postAdvertisement(token, address, description, cost).then(
          (id) => {
            router.push(`/advertisements/${id}`);
          },
          (e) => {
            if (isAxiosError(e)) {
              if (e.response) {
                if (e.response.status === 400) {
                  setShowAllert("Введены некорректные данные");
                }
              } else {
                setShowAllert("Ошибка сервера, повторите попытку позже");
              }
            }
          }
        );
      }
    }
  };

  return logged ? (
    <Box
      component="form"
      onSubmit={handleAddAdv}
      sx={{
        marginTop: "50px",
        borderRadius: "12px",
        boxShadow: "-1px 1px 10px 0px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "40px",
        minWidth: "300px",
      }}
    >
      <p className={style.titles}>Название</p>
      <TextField
        required
        size="small"
        fullWidth
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      ></TextField>
      <p className={style.titles}>Адрес</p>
      <TextField
        required
        size="small"
        fullWidth
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      ></TextField>
      <p className={style.titles}>Стоимость</p>
      <TextField
        required
        size="small"
        fullWidth
        type="number"
        error={costError.length > 0 ? true : false}
        helperText={costError}
        defaultValue={0}
        onChange={(e) => {
          setCost(+e.target.value);
        }}
      ></TextField>
      <p className={style.titles}>Описание</p>
      <TextField
        required
        size="small"
        fullWidth
        multiline
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      ></TextField>
      <Button type="submit" fullWidth variant="contained">
        Добавить
      </Button>

      <Alert severity="error" sx={{ display: showAllert === "" ? "none" : "" }}>
        <AlertTitle>Ошибка</AlertTitle>
        {showAllert}
      </Alert>
    </Box>
  ) : (
    <div></div>
  );
}
