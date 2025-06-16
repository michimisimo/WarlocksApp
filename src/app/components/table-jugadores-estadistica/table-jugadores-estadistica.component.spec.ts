import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TableJugadoresEstadisticaComponent } from './table-jugadores-estadistica.component';

describe('TableJugadoresEstadisticaComponent', () => {
  let component: TableJugadoresEstadisticaComponent;
  let fixture: ComponentFixture<TableJugadoresEstadisticaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableJugadoresEstadisticaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TableJugadoresEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
