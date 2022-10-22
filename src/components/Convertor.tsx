import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import React, { useCallback, useState } from "react";
import countries from "../countries.json";
import { Grid, InputAdornment, OutlinedInput } from "@mui/material";
import useLocalStorage from "../hooks/useLocaleStorage";

const Select = React.lazy(() => import("./Select"));

export type ConvertorProps = {};

export enum CurrencyType {
  Base,
  Convertion,
}

const Convertor: React.FC<ConvertorProps> = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [convertionCurrency, setConversionCurrency] = useLocalStorage(
    "prefered-keys",
    ["HKD", "INR", "USD"]
  );

  const [baseCurrencyConvertion, setBaseCurrencyConvertion] = useState(1);
  const [baseCurrencyAmount, setBaseCurrencyAmount] = useState(1);

  const [convertionAmount, setConvertionAmount] = useLocalStorage<
    Record<string, number>
  >("convertionAmount", {});

  const [loading, setLoading] = useState(false);

  const openDrawer = useCallback(
    (open: boolean) => () => {
      setDrawerOpen(open);
    },
    []
  );

  const onSelect = useCallback(
    (code: string, selected: boolean) => {
      if (selected) {
        setConversionCurrency((prev) => [...prev, code]);
      } else {
        setConversionCurrency((prev) => prev.filter((c) => c !== code));
      }
    },
    [setConversionCurrency]
  );

  const onConvert = useCallback(async () => {
    const myHeaders = new Headers();
    myHeaders.append("apikey", "HLV6p5huHJLBhRvdDFozhN3xsDPv8v0l");

    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };
    try {
      setLoading(true);
      const data = await fetch(
        `https://api.apilayer.com/exchangerates_data/latest?base=USD&symbols=${Object.keys(
          countries
        ).join(",")}`,
        requestOptions as RequestInit
      );
      const formatedData = await data.json();
      setConvertionAmount(formatedData.rates);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [setConvertionAmount]);

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBaseCurrencyConvertion(Number(convertionAmount[e.target.name]));
    setBaseCurrencyAmount(Number(e.target.value));
  };

  const getConvertion = useCallback(
    (code: string) => {
      const amount =
        (convertionAmount[code] / baseCurrencyConvertion) * baseCurrencyAmount;

      return Number(amount.toFixed(3));
    },
    [baseCurrencyAmount, baseCurrencyConvertion, convertionAmount]
  );

  return (
    <Container maxWidth="md">
      <Card sx={{ marginTop: 6 }} elevation={6}>
        <CardHeader title="Conversion Currencies" />
        <CardContent>
          <List>
            {convertionCurrency.map((c, i) => (
              <React.Fragment key={c}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={`data:image/png;base64, ${
                        //@ts-ignore
                        countries[c].flag
                      }`}
                      alt={c}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Grid
                        container
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          height: 40,
                        }}
                      >
                        <Grid xs={6} md={8} item>
                          {c}
                        </Grid>
                        <Grid xs={6} md={4} item>
                          {loading ? (
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <>
                              <OutlinedInput
                                type="number"
                                value={getConvertion(c)}
                                name={c}
                                sx={{ height: "40px" }}
                                onChange={onChangeInput}
                                fullWidth
                                endAdornment={
                                  <InputAdornment position="start">
                                    {
                                      //@ts-ignore
                                      countries[c].symbol
                                    }
                                  </InputAdornment>
                                }
                              />
                            </>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                </ListItem>
                {convertionCurrency.length - 1 !== i && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <Box sx={{ textAlign: "center", width: "100%", paddingY: 2 }}>
            <Button
              variant="outlined"
              sx={{ marginRight: 2 }}
              size="large"
              onClick={onConvert}
            >
              Refresh
            </Button>
            <Button variant="contained" size="large" onClick={openDrawer(true)}>
              Add
            </Button>
          </Box>
        </CardActions>
      </Card>

      <Select
        isDrawerOpen={isDrawerOpen}
        setOpenDrawer={setDrawerOpen}
        selectedCurrencies={convertionCurrency}
        onSelect={onSelect}
      />
    </Container>
  );
};

export default Convertor;
