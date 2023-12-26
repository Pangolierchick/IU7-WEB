"use client";
import AdvertisementTable from "@/components/userPage/advertisementsTable";
import RentsTable from "@/components/userPage/rentsTable";
import { getAdvertisementsById } from "@/services/advertisements";
import { getRents } from "@/services/rents";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function UserPage({ params }: { params: { id: string } }) {
  const [advertisements, setAdvertisements] = useState([]);
  const [rents, setRents] = useState([]);

  useEffect(() => {
    getAdvertisementsById(params.id).then((d) => {
      setAdvertisements(d);
    });

    getRents(params.id).then((d) => {
      console.log(d);
      setRents(d);
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "50px",
        marginBottom: "50px",
        gap: "50px",
      }}
    >
      <AdvertisementTable advertisements={advertisements} />

      <RentsTable rents={rents} />
    </Box>
  );
}
