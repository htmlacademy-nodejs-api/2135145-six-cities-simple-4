export const AppComponent = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseClientInterface: Symbol.for('DatabaseClientInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  OfferModel: Symbol.for('OfferModel'),
  CityServiceInterface: Symbol.for('CityServiceInterface'),
  CityModel: Symbol.for('CityModel'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentModel: Symbol.for('CommentModel'),
} as const;
