import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";

const PriceTaps = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 20px 0px;
  gap: 10px;
`;

interface IStyledProps {
  textColor?: "red" | "green";
}

const PriceTap = styled.div<IStyledProps>`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 20px;
  background-color: ${(props) => props.theme.boxColor};
  box-shadow: ${(props) => props.theme.boxShadow};
  padding: 30px 10px;
  border-radius: 10px;
  gap: 20px;
  span:last-child {
    color: ${(props) =>
      props.textColor ? props.textColor : props.theme.textColor};
  }
`;

const LongPriceTap = styled.div<IStyledProps>`
  display: flex;
  height: 100%;
  flex-direction: column;
  text-align: center;
  font-size: 20px;
  justify-content: center;
  line-height: 35px;
  margin-bottom: 20px;
  width: 100%;
  height: 100px;
  background-color: ${(props) => props.theme.boxColor};
  box-shadow: ${(props) => props.theme.boxShadow};
  border-radius: 10px;
  color: ${(props) => props.theme.accentColor};
  span:last-child {
    color: ${(props) =>
      props.textColor ? props.textColor : props.theme.textColor};
  }
`;

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface IChartProps {
  coinId: string;
  tickersData: {
    quotes: {
      USD: {
        ath_price: number;
        market_cap: number;
        percent_change_1h: number;
        percent_change_24h: number;
        percent_change_7d: number;
        percent_change_30d: number;
        volume_24h: number;
        percent_from_price_ath: number;
      };
    };
  };
}

function Price() {
  const { coinId, tickersData } = useOutletContext<IChartProps>();
  const priceData = tickersData.quotes.USD;
  console.log(priceData);
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );
  const upArrow = "% ⬆";
  const downArrow = "% ⬇";

  return (
    <div>
      {isLoading ? (
        "Loading Price Info..."
      ) : (
        <>
          <LongPriceTap
            textColor={priceData.percent_from_price_ath > 0 ? "red" : "green"}
          >
            <span>Percent Changes from ATH</span>
            <span>
              {priceData.percent_from_price_ath}
              {priceData.percent_from_price_ath > 0 ? upArrow : downArrow}
            </span>
          </LongPriceTap>
          <PriceTaps>
            <PriceTap>
              <span>Market Cap</span>
              <span>$ {priceData.market_cap}</span>
            </PriceTap>
            <PriceTap>
              <span>ATH Price</span>
              <span>$ {priceData.ath_price}</span>
            </PriceTap>
            <PriceTap
              textColor={priceData.percent_change_1h > 0 ? "red" : "green"}
            >
              <span>
                than
                <br /> 1 Hour ago...
              </span>
              <span>
                {priceData.percent_change_1h}
                {priceData.percent_change_1h > 0 ? upArrow : downArrow}
              </span>
            </PriceTap>
            <PriceTap
              textColor={priceData.percent_change_24h > 0 ? "red" : "green"}
            >
              <span>
                than <br />1 Day ago...
              </span>
              <span>
                {priceData.percent_change_24h}
                {priceData.percent_change_24h > 0 ? upArrow : downArrow}
              </span>
            </PriceTap>
            <PriceTap
              textColor={priceData.percent_change_7d > 0 ? "red" : "green"}
            >
              <span>
                than
                <br /> 1 Week ago...
              </span>
              <span>
                {priceData.percent_change_7d}
                {priceData.percent_change_7d > 0 ? upArrow : downArrow}
              </span>
            </PriceTap>
            <PriceTap
              textColor={priceData.percent_change_30d > 0 ? "red" : "green"}
            >
              <span>
                than
                <br /> 1 Month ago...
              </span>
              <span>
                {priceData.percent_change_30d}
                {priceData.percent_change_30d > 0 ? upArrow : downArrow}
              </span>
            </PriceTap>
          </PriceTaps>
          <LongPriceTap>
            <span>Volume (24H)</span>
            <span>{priceData.volume_24h}</span>
          </LongPriceTap>
        </>
      )}
    </div>
  );
}

export default Price;
