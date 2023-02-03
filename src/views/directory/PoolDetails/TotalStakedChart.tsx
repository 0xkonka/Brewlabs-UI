/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { makeSkeletonComponent } from "utils/functions";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalStakedChart = ({ data, symbol }: { data: any; symbol: string }) => {
  const chartData: any = {
    series: [
      {
        name: "Price",
        data: data ? data : [],
      },
    ],
    options: {
      colors: ["#FFDE0D"],
      fill: {
        gradient: {
          type: "vertical",
          shadeIntensity: 0.5,
          inverseColors: true,

          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: "#EEBB19",
              opacity: 1,
            },
            {
              offset: 100,
              color: "rgb(110, 220, 181)",
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
            return value;
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
    <StyledContainer>
      <div className="text-xl text-[#FFFFFFBF]">Total Staked Value</div>
      <div className="leading-none text-[#FFFFFF80]">
        {data !== undefined ? `$${data[data.length - 1]}` : makeSkeletonComponent()}
        <br />
        <span className="flex text-primary">
          {data !== undefined ? data[data.length - 1] : makeSkeletonComponent()}&nbsp;{symbol}
        </span>
        <br />
        <span className="text-[#B9B8B8]">{new Date().toLocaleDateString()}</span>
      </div>
      <div className="-mt-12">
        <Chart options={chartData.options} series={chartData.series} type="area" height={280} />
      </div>
    </StyledContainer>
  );
};

export default TotalStakedChart;

const StyledContainer = styled.div`
  .apexcharts-tooltip {
    color: white;
  }
  .apexcharts-tooltip.apexcharts-theme-light {
    background: rgba(110, 220, 181, 0.5);
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
