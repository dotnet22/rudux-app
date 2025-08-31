// Generic friendly filter resolver hooks
export {
  useGenericFriendlyFilterResolver,
  useAutoFriendlyFilterResolver,
  useGenericFriendlyFilterWithMemoization,
  type GenericFriendlyFilterConfig
} from './useGenericFriendlyFilterResolver'

// Preset configurations for common filter models
export {
  createProgramFilterResolverConfig,
  createAcademicYearFilterResolverConfig,
  commonFieldResolvers,
  createCustomFieldResolvers
} from './presetConfigurations'

