import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentTestPage } from './component-test.page';

describe('ComponentTestPage', () => {
  let component: ComponentTestPage;
  let fixture: ComponentFixture<ComponentTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
