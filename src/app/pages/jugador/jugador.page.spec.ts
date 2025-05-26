import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JugadorPage } from './jugador.page';

describe('JugadorPage', () => {
  let component: JugadorPage;
  let fixture: ComponentFixture<JugadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JugadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
