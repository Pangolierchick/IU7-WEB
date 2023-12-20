"use client";
import Advertisement from "@/components/advertisement/advertisement";
import { getAdvertisement } from "@/services/advertisement";
import { Box, Button, TextField } from "@mui/material";
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

  useEffect(() => {
    getAdvertisement(params.id).then(
      (v) => {
        setTitle("Название");
        setAddress(v.address);
        setDescr(v.description);
        setOwner(v.ownerId);
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
        position: "absolute",
        minWidth: "400px",
        maxWidth: "800px",
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        gap: "50px",
      }}
    >
      <Advertisement
        title={title}
        address={address}
        description={descr}
        owner={owner}
      />

      <Box
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
          <TextField label="Дата въезда" type="date" focused></TextField>
          <TextField label="Дата выезда" type="date" focused></TextField>
        </Box>

        <Button fullWidth variant="contained">
          Забронировать
        </Button>
      </Box>
    </Box>
  ) : (
    <h1>Ошибка</h1>
  );
}
