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
import countries from "./../countries.json";

const Select = React.lazy(() => import("./Select"));

export type ConvertorProps = {};

export enum CurrencyType {
  Base,
  Convertion,
}

const Convertor: React.FC<ConvertorProps> = (props) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [convertionCurrency, setConversionCurrency] = useState(["HKD", "INR"]);
  const [currenctSelectedCurrencies, setCurrenctSelectedCurrencies] = useState([
    "USD",
  ]);
  const [convertionAmount, setConvertionAmount] = useState<
    Record<string, string>
  >({});

  const [selectedType, setSelecetdType] = useState(CurrencyType.Base);

  const [loading, setLoading] = useState(false);

  const openDrawer = useCallback(
    (open: boolean, currencySelected: CurrencyType) => () => {
      if (open) {
        if (currencySelected === CurrencyType.Base) {
          setCurrenctSelectedCurrencies([baseCurrency]);
        } else {
          setCurrenctSelectedCurrencies(convertionCurrency);
        }
      }

      setSelecetdType(currencySelected);
      setDrawerOpen(open);
    },
    [baseCurrency, convertionCurrency]
  );

  const onSelect = useCallback(
    (code: string, selected: boolean) => {
      if (selectedType === CurrencyType.Base) {
        if (selected) {
          if (baseCurrency !== code) {
            setConvertionAmount({});
          }
          setBaseCurrency(code);
          setDrawerOpen(false);
        } else {
          setBaseCurrency("USD");
          setConvertionAmount({});
        }
      } else {
        if (selected) {
          setConversionCurrency((prev) => [...prev, code]);
        } else {
          setConversionCurrency((prev) => prev.filter((c) => c !== code));
        }
      }
    },
    [baseCurrency, selectedType]
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
        `https://api.apilayer.com/exchangerates_data/latest?base=${baseCurrency}&symbols=${Object.keys(
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
  }, [baseCurrency]);

  return (
    <Container maxWidth="md">
      <Card sx={{ marginTop: 6 }} elevation={6}>
        <CardHeader title="Base Currency" />
        <CardContent>
          <Button
            variant="outlined"
            sx={{ width: "75%" }}
            onClick={openDrawer(true, CurrencyType.Base)}
          >
            {baseCurrency}
          </Button>
        </CardContent>
        <CardHeader title="Conversion Currencies" />
        <CardContent>
          <List>
            {convertionCurrency.map((c, i) => (
              <React.Fragment key={c}>
                <ListItem onClick={openDrawer(true, CurrencyType.Convertion)}>
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          height: 40,
                        }}
                      >
                        <Box>{c}</Box>
                        <Box>
                          {loading ? (
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                            />
                          ) : (
                            convertionAmount[c] ?? 0
                          )}
                        </Box>
                      </Box>
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
            <Button variant="contained" size="large" onClick={onConvert}>
              Convert
            </Button>
          </Box>
        </CardActions>
      </Card>

      <Select
        isDrawerOpen={isDrawerOpen}
        setOpenDrawer={setDrawerOpen}
        selectedCurrencies={currenctSelectedCurrencies}
        onSelect={onSelect}
      />
    </Container>
  );
};

export default Convertor;
