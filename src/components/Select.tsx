import {
  Avatar,
  Box,
  Checkbox,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

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
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpenDrawer(open);
    };

  return (
    <Drawer anchor={"left"} open={isDrawerOpen} onClose={toggleDrawer(false)}>
      <Box sx={{ paddingX: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            position: "sticky",
            top: 0,
            paddingY: 1,
            background: "white",
            zIndex: 1,
          }}
        >
          <IconButton aria-label="cancel" onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {Object.entries(countries).map(([code, entry]) => {
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
                  <ListItemText
                    id={code}
                    primary={`${entry.code} - ${entry.name}`}
                  />
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
