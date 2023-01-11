/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PerformanceChart = ({ tokens }: any) => {
  if (!tokens.length) return <></>;
  let pricehistory: any = [];
  for (let i = 0; i < tokens[0].priceList.length; i++) {
    pricehistory[i] = 0;
    for (let j = 0; j < tokens.length; j++) {
      pricehistory[i] += (tokens[j].priceList[i] * tokens[j].balance) / Math.pow(10, tokens[j].decimals);
    }
  }
  console.log(pricehistory);
  const priceChange = pricehistory[pricehistory.length - 1] - pricehistory[0];
  let priceChangePercent = (priceChange / pricehistory[0]) * 100;
  priceChangePercent = priceChangePercent < 0 ? -priceChangePercent : priceChangePercent;
  const chartData: any = {
    series: [
      {
        name: "Price",
        data: pricehistory,
      },
    ],
    options: {
      colors: [priceChange >= 0 ? "#2FD35D" : "#ea3943"],
      fill: {
        gradient: {
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,

          stops: [0, 100],
          colorStops:
            priceChange >= 0
              ? [
                  {
                    offset: 0,
                    color: "rgb(110, 220, 181)",
                    opacity: 0.4,
                  },
                  {
                    offset: 100,
                    color: "rgb(110, 220, 181)",
                    opacity: 0,
                  },
                ]
              : [
                  {
                    offset: 0,
                    color: "#ea3943",
                    opacity: 0.4,
                  },
                  {
                    offset: 100,
                    color: "#ea3943",
                    opacity: 0,
                  },
                ],
        },
      },
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      tooltip: {
        y: {
          format: "",
          formatter: (value: any) => {
            return "$" + Number(value).toFixed(2);
          },
        },
      },
      grid: {
        show: false,
      },
      legend: {
        show: false,
      },
    },
  };
  return (
    <StyledContainer down={(priceChange < 0).toString()}>
      <div className={"flex items-center justify-between font-semibold text-white"}>
        <div className={"flex items-center"}>
          <div className={"ml-4 w-[140px] text-sm sm:ml-16 sm:w-[180px]"}>
            <div>Performance</div>
            <div className={"text-2xl font-bold"}>{pricehistory[pricehistory.length - 1].toFixed(2)}</div>
            <div className={"flex items-center"}>
              <StyledColor down={(priceChange < 0).toString()} className={"mr-1"}>
                ${(priceChange < 0 ? -priceChange : priceChange).toFixed(2)}
              </StyledColor>
              <img src={priceChange > 0 ? "/images/dashboard/up.svg" : "/images/dashboard/down.svg"} alt={""} />
            </div>
          </div>
          <div className={"text-grey opacity-70"}>24hrs</div>
        </div>
        <StyledColor down={(priceChange < 0).toString()}>
          {priceChange > 0 ? "+" : "-"}
          {priceChangePercent.toFixed(2)}%
        </StyledColor>
      </div>
      <div>
        {typeof window !== "undefined" && (
          <Chart options={chartData.options} series={chartData.series} type="area" height={165} />
        )}
      </div>
    </StyledContainer>
  );
};

export default PerformanceChart;

const StyledColor = styled.div<{ down: String }>`
  color: ${({ down }) => (down === "true" ? "#ea3943" : "#2FD35D")};
`;
const StyledContainer = styled.div<{ down: String }>`
  .apexcharts-tooltip {
    color: white;
  }
  .apexcharts-tooltip.apexcharts-theme-light {
    background: ${({ down }) => (down === "true" ? "rgba(234, 57, 67, 0.5)" : "rgba(110, 220, 181, 0.5)")};
  }
  .apexcharts-tooltip-title {
    display: none;
  }
  .apexcharts-xaxistooltip {
    display: none;
  }
  .apexcharts-tooltip.apexcharts-theme-light {
    border: none;
  }
  .apexcharts-tooltip-text-y-label {
    display: none;
  }
  .apexcharts-tooltip-marker {
    margin-right: 0;
  }
  .apexcharts-tooltip-text-y-value {
    font-size: 16px;
  }
  > div:nth-child(2) > div {
    min-height: unset !important;
    margin-top: -20px;
  }
`;
