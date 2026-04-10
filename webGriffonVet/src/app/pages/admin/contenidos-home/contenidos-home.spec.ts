import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidosHome } from './contenidos-home';

describe('ContenidosHome', () => {
  let component: ContenidosHome;
  let fixture: ComponentFixture<ContenidosHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidosHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenidosHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
