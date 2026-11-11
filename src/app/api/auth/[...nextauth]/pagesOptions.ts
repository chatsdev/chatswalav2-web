import { ROUTES } from '@/src/constants';
import { PagesOptions } from 'next-auth';

export const pagesOptions: Partial<PagesOptions> = {
  signIn: ROUTES.Landing, // unauthenticated / logout → landing page first
  error: ROUTES.Login, // auth errors still show the login form
};
