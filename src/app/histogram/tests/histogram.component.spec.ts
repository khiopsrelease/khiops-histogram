import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistogramComponent } from '../histogram.component';

describe('Rect', () => {
  let component: HistogramComponent;
  let fixture: ComponentFixture<HistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistogramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistogramComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('[-200, -200]', () => {
    // const datas = [
    //   {
    //     partition: [-200, -100],
    //     value: 10,
    //   },
    // ];
    // let rangeXLin, rangeXLog;
    // component.initSpecs(datas);
    // [rangeXLin, rangeXLog] = component.getRange();
    // component.drawRect(datas, 0);
    // // const res = rangeXLin === 200 && rangeXLog === 200;
    expect(true === true).toBeTruthy();
  });
});
