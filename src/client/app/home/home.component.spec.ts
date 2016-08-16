import { beforeEachProviders, inject, async, ComponentFixture } from '@angular/core/testing';
import { OverridingTestComponentBuilder } from '@angular/compiler/testing';
import { provide } from '@angular/core';

import { HomeComponent } from './home.component';
import { AuthService } from '../login/auth.service';
import { GithubCacheService } from '../shared/github';
import { HomeService } from './home.service';

describe('Home Component', () => {
  let fixture: ComponentFixture<HomeComponent>;

  const testUser = {};
  const authServiceMock = jasmine.createSpyObj('AuthServiceMock', ['doLogout']);
  const githubCacheServiceMock = {
    currentUser: jasmine.createSpyObj('currentUser', ['subscribe'])
  };
  const homeServiceMock = jasmine.createSpyObj('homeServiceMock', [
    'requestReposFromBackend',
    'requestOrgsFromBackend'
  ]);

  beforeEachProviders(() => [
    OverridingTestComponentBuilder,
    provide(AuthService, { useValue: authServiceMock })
  ]);

  beforeEach(async(inject([OverridingTestComponentBuilder], (tcb: OverridingTestComponentBuilder) => {
    return tcb
      .overrideTemplate(HomeComponent, '<div></div>')
      .overrideProviders(HomeComponent, [
        provide(GithubCacheService, { useValue: githubCacheServiceMock }),
        provide(HomeService, { useValue: homeServiceMock })
      ])
      .createAsync(HomeComponent)
      .then(f => fixture = f);
  })));

  it('should request the current user on init', () => {
    fixture.detectChanges();
    expect(githubCacheServiceMock.getCurrentUser().subscribe).toHaveBeenCalledTimes(1);
  });

  describe('handleLogout', () => {
    it('should log out the user', () => {
      fixture.componentInstance.handleLogout();
      expect(authServiceMock.doLogout).toHaveBeenCalledTimes(1);
    });
  });

});