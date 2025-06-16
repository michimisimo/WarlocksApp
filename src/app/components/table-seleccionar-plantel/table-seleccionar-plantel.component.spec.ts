import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TableSeleccionarPlantelComponent } from './table-seleccionar-plantel.component';

describe('TableSeleccionarPlantelComponent', () => {
  let component: TableSeleccionarPlantelComponent;
  let fixture: ComponentFixture<TableSeleccionarPlantelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSeleccionarPlantelComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TableSeleccionarPlantelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
