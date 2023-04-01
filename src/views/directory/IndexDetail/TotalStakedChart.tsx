/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { BigNumberFormat, formatDollar, numberWithCommas } from "utils/functions";
import { SkeletonComponent } from "components/SkeletonComponent";
import { IndexContext } from "contexts/directory/IndexContext";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalStakedChart = ({
  data,
  symbol,
  price,
  curGraph,
}: {
  data: any;
  symbol: string;
  price: number;
  curGraph: number;
}) => {
  const getTitle = (type: number) => {
    if (type === 0) {
      return "Total Index Value";
    } else if (type === 1) {
      return (
        <div>
          Performance fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
        </div>
      );
    } else if (type === 2) {
      return (
        <div>
          Index Performance<span className="text-[#FFFFFF80]"> (Price - 24hrs)</span>
        </div>
      );
    } else if (type === 3) {
      return (
        <div>
          Owner comissions<span className="text-[#FFFFFF80]"> (24hrs)</span>
        </div>
      );
    }
  };

  const pricechange = data.length ? ((data[data.length - 1] - data[0]) / data[0]) * 100 : 0;

  const chartData: any = {
    series: [
      {
        name: "Price",
        data: data ? data : [],
      },
    ],
    options: {
      colors: [pricechange >= 0 ? "#2FD35D" : "#ea3943"],
      fill: {
        gradient: {
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,

          stops: [0, 100],
          colorStops:
            pricechange >= 0
              ? [
                  {
                    offset: 0,
                    color: "#2FD35D",
                    opacity: 0.75,
                  },
                  {
                    offset: 100,
                    color: "#6EDCB5",
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
            return (value * price).toFixed(2) + "%";
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

  const { rate }: any = useContext(IndexContext);
  return (
    <StyledContainer down={(pricechange < 0).toString()}>
      <div className="text-xl text-[#FFFFFFBF]">{getTitle(curGraph)}</div>
      <div className="leading-none text-[#FFFFFF80]">
        <span>{curGraph === 2 ? formatDollar(rate[3].value, 4) : data[data.length - 1] * price}</span>
        <span className="flex">
          {data !== undefined && data.length ? (
            <span className={data[data.length - 1] < 0 ? "text-danger" : "text-sucess"}>
              {numberWithCommas(data[data.length - 1].toFixed(curGraph === 2 ? 2 : 0)) + (curGraph === 2 ? "%" : "")}
            </span>
          ) : (
            <SkeletonComponent />
          )}
          &nbsp;
          {symbol}
        </span>
        <span className="text-[#B9B8B8]">{new Date().toDateString()}</span>
      </div>
      <div className="-mt-2">
        <Chart options={chartData.options} series={chartData.series} type="area" height={250} />
      </div>
    </StyledContainer>
  );
};

export default TotalStakedChart;

const StyledContainer = styled.div<{ down: string }>`
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
    margin-top: -23px;
  }
  height: 250px;
  @media screen and (max-height: 725px) {
    height: 200px;
  }
`;
