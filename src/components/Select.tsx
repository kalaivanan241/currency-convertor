import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import React, { useCallback, useMemo, useState } from "react";

import countries from "./../countries.json";

type SelectProps = {
  isDrawerOpen: boolean;
  setOpenDrawer: (open: boolean) => void;
  selectedCurrencies?: string[];
  onSelect: (code: string, isSelected: boolean) => void;
};

const Select: React.FC<SelectProps> = ({
  isDrawerOpen,
  setOpenDrawer,
  selectedCurrencies,
  onSelect,
}) => {
  const [searchText, setSearchText] = useState("");

  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpenDrawer(open);
    },
    [setOpenDrawer]
  );

  const filteredResult = useMemo(() => {
    if (!searchText) return Object.values(countries);

    return Object.values(countries).filter((c) => {
      return `${c.code} ${c.name} ${c.symbol}`
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  }, [searchText]);

  return (
    <Drawer anchor={"left"} open={isDrawerOpen} onClose={toggleDrawer(false)}>
      <Box sx={{ paddingX: 2 }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            paddingY: 1,
            background: "white",
            zIndex: 1,
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              //   width: 400,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Currencies"
              inputProps={{ "aria-label": "search currencies" }}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              value={searchText}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              {!searchText ? <SearchIcon /> : <CloseIcon />}
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="directions"
              onClick={toggleDrawer(false)}
            >
              <CloseIcon />
            </IconButton>
          </Paper>
        </Box>
        <List>
          {filteredResult.map(({ code, ...entry }) => {
            return (
              <ListItem
                key={code}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    defaultChecked={selectedCurrencies?.includes(code)}
                    onChange={(event) => {
                      onSelect(code, event.target.checked);
                    }}
                  />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      src={`data:image/png;base64, ${entry.flag}`}
                      alt={code}
                    />
                  </ListItemAvatar>
                  <ListItemText id={code} primary={`${code} - ${entry.name}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Select;
