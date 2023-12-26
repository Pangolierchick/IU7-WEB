"use client";
import Advertisement from "@/components/advertisement/advertisement";
import { getAdvertisement } from "@/services/advertisements";
import { postRent } from "@/services/rents";
import { Alert, AlertTitle, Box, Button, TextField } from "@mui/material";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdvertisementPage({
  params,
}: {
  params: { id: string };
}) {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [descr, setDescr] = useState("");
  const [owner, setOwner] = useState("");
  const [error, setError] = useState(false);
  const [cost, setCost] = useState(0);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showAllert, setShowAllert] = useState("");

  const router = useRouter();

  const submitRent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (token) {
      postRent(token, params.id, from, to).then(
        (data) => {
          router.push("/");
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
  };

  useEffect(() => {
    setToken(getCookie("token"));
    getAdvertisement(params.id).then(
      (v) => {
        setTitle("Название");
        setAddress(v.address);
        setDescr(v.description);
        setOwner(v.user.login);
        setCost(v.cost);
      },
      (e) => {
        setError(true);
      }
    );
  }, []);

  return !error ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "50px",
        marginTop: "50px",
      }}
    >
      <Advertisement
        title={title}
        address={address}
        description={descr}
        owner={owner}
      />

      {token ? (
        <Box
          component="form"
          onSubmit={submitRent}
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            boxShadow: "-1px 1px 10px 0px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#ffffff",
            height: "fit-content",
            gap: "20px",
            padding: "40px",
          }}
        >
          <p>{`${cost}₽ ночь`}</p>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <TextField
              label="Дата въезда"
              type="date"
              focused
              onChange={(e) => {
                setFrom(e.target.value);
              }}
            ></TextField>
            <TextField
              label="Дата выезда"
              type="date"
              focused
              onChange={(e) => {
                setTo(e.target.value);
              }}
            ></TextField>
          </Box>

          <Button type="submit" fullWidth variant="contained">
            Забронировать
          </Button>

          <Alert
            severity="error"
            sx={{ display: showAllert === "" ? "none" : "" }}
          >
            <AlertTitle>Ошибка</AlertTitle>
            {showAllert}
          </Alert>
        </Box>
      ) : (
        <Box> </Box>
      )}
    </Box>
  ) : (
    <Alert severity="error">
      <AlertTitle>Ошибка</AlertTitle>
      Такое объявление не было найдено
    </Alert>
  );
}
