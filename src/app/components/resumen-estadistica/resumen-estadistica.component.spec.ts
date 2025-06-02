import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResumenEstadisticaComponent } from './resumen-estadistica.component';

describe('ResumenEstadisticaComponent', () => {
  let component: ResumenEstadisticaComponent;
  let fixture: ComponentFixture<ResumenEstadisticaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenEstadisticaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
