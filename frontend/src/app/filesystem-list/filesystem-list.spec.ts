import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesystemList } from './filesystem-list';

describe('FilesystemList', () => {
  let component: FilesystemList;
  let fixture: ComponentFixture<FilesystemList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesystemList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesystemList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
