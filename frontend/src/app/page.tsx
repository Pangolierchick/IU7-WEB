"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");

  const router = useRouter();
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };
  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "60%",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "-1px 1px 10px 0px rgba(0, 0, 0, 0.15)",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          "& fieldset": { border: "none" },
          "& input": { fontSize: "20px" },
        }}
      ></TextField>
      <IconButton type="submit" sx={{ p: "12px" }}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
