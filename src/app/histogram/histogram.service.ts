import { Injectable } from '@angular/core';
import { HistogramType } from './histogram.types';

@Injectable({
  providedIn: 'root',
})
export class HistogramService {
  rangeXLog: number = 0;
  rangeXLin: number = 0;
  rangeY: number = 0;

  constructor() {}

  getRangeX(datas: any) {
    this.rangeXLog = 0;
    this.rangeXLin = 0;
    datas.forEach((d: any, i: number) => {
      if (d.partition[0] !== 0) {
        if (Math.abs(d.partition[0]) > this.rangeXLog) {
          this.rangeXLog = Math.abs(d.partition[0]);
        }
        if (Math.abs(1 / d.partition[0]) > this.rangeXLog) {
          this.rangeXLog = Math.abs(1 / d.partition[0]);
        }
        if (Math.abs(d.partition[0]) > this.rangeXLin) {
          this.rangeXLin = Math.abs(d.partition[0]);
        }
      }
      if (d.partition[1] !== 0) {
        if (Math.abs(d.partition[1]) > this.rangeXLog) {
          this.rangeXLog = Math.abs(d.partition[1]);
        }
        if (Math.abs(1 / d.partition[1]) > this.rangeXLog) {
          this.rangeXLog = Math.abs(1 / d.partition[1]);
        }
        if (Math.abs(d.partition[1]) > this.rangeXLin) {
          this.rangeXLin = Math.abs(d.partition[1]);
        }
      }
    });

    return [this.rangeXLin, this.rangeXLog];
  }

  getRangeY(datas: any) {
    const dataValues = datas.map((e: any) => e.value);
    this.rangeY = Math.max(...dataValues);
    return this.rangeY;
  }

  getSign(input: number) {
    return input > 0 ? '' : '-';
  }

  getRatioX(type: string, chartW: number) {
    const currentRange =
      type === HistogramType.LIN ? this.rangeXLin : this.rangeXLog;
    let ratioX = chartW / currentRange;
    if (type === HistogramType.LOG) {
      let maxVal = Math.log10(Math.abs(currentRange));
      if (maxVal === -Infinity) {
        maxVal = 1;
      }
      ratioX = chartW / maxVal;
    }
    return ratioX;
  }

  getLogRatioX(chartW: number, middle: number) {
    let ratioX = (chartW + 0) / this.rangeXLog;
    let maxVal = Math.log10(Math.abs(this.rangeXLog));
    if (maxVal === -Infinity) {
      maxVal = 1;
    }
    ratioX = chartW / maxVal;

    return ratioX;
  }

  getRatioY(h: number, padding: number) {
    return (h - padding / 2) / this.rangeY;
  }

  getVisibleChartsCount(logView: any) {
    let visibleChartsCount = 0;
    Object.keys(logView).forEach((key: any) => {
      if (logView[key] && key !== 'p0') {
        visibleChartsCount++;
      }
    });
    return visibleChartsCount;
  }

  getLogChartVisibility(datas: any) {
    let logView = {
      p1N: 1,
      p0N: 1,
      p0: 1,
      p0P: 1,
      p1P: 1,
    };
    logView.p1N =
      datas.find((e: any) => {
        return e.partition[0] <= -1 || e.partition[1] <= -1;
      }) !== undefined
        ? 1
        : 0;
    logView.p0N =
      datas.find((e: any) => {
        return (
          (e.partition[0] < 0 && e.partition[0] > -1) ||
          (e.partition[1] < 0 && e.partition[1] > -1)
        );
      }) !== undefined
        ? 1
        : 0;
    // logView.p0 =
    //   datas.find((e: any) => {
    //     return e.partition[0] == 0 || e.partition[1] === 0;
    //   }) !== undefined
    //     ? 1
    //     : 0;
    logView.p0P =
      datas.find((e: any) => {
        return (
          (e.partition[0] > 0 && e.partition[0] < 1) ||
          (e.partition[1] > 0 && e.partition[1] < 1)
        );
      }) !== undefined
        ? 1
        : 0;
    logView.p1P =
      datas.find((e: any) => {
        return e.partition[0] >= 1 || e.partition[1] >= 1;
      }) !== undefined
        ? 1
        : 0;

    logView.p0 = logView.p0P || logView.p0N ? 1 : 0;

    return logView;
  }

  isChartVisible(datas: any, type = HistogramType.LIN, part: any) {
    if (type === HistogramType.LIN) {
      if (part === 1) {
        return datas[0].partition[0] < 0;
      } else {
        return datas[datas.length - 1].partition[1] > 0;
      }
    } else {
      if (part === 1) {
        return datas[0].partition[0] < 0;
      } else if (part === 2) {
        return datas[datas.length - 1].partition[1] > 0;
      } else if (part === '1a') {
        return (
          datas.find((e: any) => {
            return e.partition[0] <= -1 || e.partition[1] <= -1;
          }) !== undefined
        );
      } else if (part === '1b') {
        return (
          datas.find((e: any) => {
            return (
              (e.partition[0] <= 0 && e.partition[0] > -1) ||
              (e.partition[1] <= 0 && e.partition[1] > -1)
            );
          }) !== undefined
        );
      } else if (part === '2a') {
        return (
          datas.find((e: any) => {
            return (
              (e.partition[0] > 0 && e.partition[0] < 1) ||
              (e.partition[1] > 0 && e.partition[1] < 1)
            );
          }) !== undefined
        );
      } else if (part === '2b') {
        return (
          datas.find((e: any) => {
            return e.partition[0] >= 1 || e.partition[1] >= 1;
          }) !== undefined
        );
      }
    }
    return true;
  }

  getLogBarDimensions(
    d: any,
    chartW: any,
    padding = 0,
    middleW = 0,
    ratioX = 0,
    logView: any
  ) {
    let shift = 0;
    let barW = 0;
    let barX = 0;
    let x = 0;
    let barMin = 0;
    let color = '#023047';

    barMin = Math.min(d.partition[1], d.partition[0]);
    barX = Math.log10(Math.abs(barMin));
    let visibleChartsCount = this.getVisibleChartsCount(logView);

    if (d.partition[0] >= 1 || d.partition[0] > 0) {
      shift =
        padding +
        logView.p1N * chartW.p1N +
        logView.p0N * chartW.p0N +
        logView.p0 * chartW.p0 +
        logView.p0P * chartW.p0P;
      barW =
        Math.log10(Math.abs(d.partition[1])) -
        Math.log10(Math.abs(d.partition[0]));
      barW = barW / visibleChartsCount;
      x = shift + (ratioX / visibleChartsCount) * barX;
    } else if (d.partition[1] <= -1 || d.partition[1] < 0) {
      color = '#ffb703';
      shift = padding + logView.p1P * chartW.p1P;
      barW =
        Math.log10(Math.abs(d.partition[0])) -
        Math.log10(Math.abs(d.partition[1]));
      barW = barW / visibleChartsCount;
      x = shift - (ratioX / visibleChartsCount) * barX;
    } else {
      let isZeroP0 = d.partition[0] === 0;
      let isZeroP1 = d.partition[1] === 0;
      if (isZeroP0) {
        shift =
          padding +
          logView.p1N * chartW.p1N +
          logView.p0N * chartW.p0N +
          logView.p0 * chartW.p0;
        x = shift - middleW / 2;
        barW = middleW / 2 / ratioX;
        barW =
          barW +
          (logView.p0P * chartW.p0P) / ratioX +
          Math.log10(Math.abs(d.partition[1])) / visibleChartsCount;
      } else if (isZeroP1) {
        color = '#ffb703';

        shift =
          padding +
          logView.p1N * chartW.p1N +
          logView.p0N * chartW.p0N +
          middleW / 2;
        barW = middleW / 2 / ratioX;
        barW =
          barW +
          (logView.p1P * chartW.p1P) / ratioX +
          Math.log10(Math.abs(d.partition[0])) / visibleChartsCount;
        x = shift - barW * ratioX;
      } else {
        color = '#fb8500';

        // partition is neg and pos
        barW = middleW / ratioX;
        barW =
          barW +
          Math.log10(Math.abs(d.partition[0])) / visibleChartsCount +
          Math.log10(Math.abs(d.partition[1])) / visibleChartsCount;

        shift = padding;

        if (d.partition[0] < -1) {
          barW = barW + (logView.p0P * chartW.p0P) / ratioX;
          shift =
            padding +
            logView.p1N * chartW.p1N -
            (ratioX / visibleChartsCount) * barX;
        } else if (d.partition[0] < 0) {
          barW =
            barW +
            (logView.p0N * chartW.p0N + logView.p0P * chartW.p0P) / ratioX;

          shift =
            padding +
            logView.p1N * chartW.p1N -
            (Math.log10(Math.abs(d.partition[0])) / visibleChartsCount) *
              ratioX;
        }

        x = shift;
      }
    }

    // console.warn(
    //   'file: histogram.service.ts:305 ~ HistogramService ~ x, barW:',
    //   x,
    //   barW
    // );
    return [x, barW, color];
  }
  getLinBarDimensions(
    d: any,
    chartW = 0,
    padding = 0,
    ratioX = 0,
    linPart1 = true,
    linPart2 = true
  ) {
    let shift = 0;
    let barW = 0;
    let barX = 0;
    let x = 0;
    let barMin = 0;

    barMin = Math.min(d.partition[1], d.partition[0]);

    let n = 0;
    if (linPart1 && linPart2) {
      barX = barMin;
    } else if (linPart1) {
      n = 1;
      barX = barMin * 2;
    } else {
      n = -1;
      barX = barMin * 2;
    }

    shift = chartW * (1 + n) + padding;
    x = shift + ratioX * barX;
    let barMax = Math.max(d.partition[1], d.partition[0]);

    barW = barMax - barMin;
    if (!(linPart1 && linPart2)) {
      barW = 2 * barW;
    }
    return [x, barW];
  }
}
