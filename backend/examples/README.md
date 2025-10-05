# Enterprise Capabilities Examples

This directory contains example code demonstrating how to use the enterprise capabilities implemented in Purple Cross.

## Files

- **circuit-breaker-example.ts** - Examples of using circuit breakers for resilient service calls
- **retry-example.ts** - Examples of implementing retry logic with exponential backoff

## Running Examples

These examples are for reference and education. To use them in your code:

1. Import the utilities:
```typescript
import { createCircuitBreaker } from '../src/utils/circuitBreaker';
import { retry, retryWithJitter } from '../src/utils/retry';
```

2. Follow the patterns shown in the examples
3. Adapt the configuration to your specific use case

## Quick Start Examples

### Circuit Breaker

```typescript
import { createCircuitBreaker } from './utils/circuitBreaker';

const breaker = createCircuitBreaker('my-service', {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 60000,
});

const result = await breaker.execute(async () => {
  return await externalService.call();
});
```

### Retry Logic

```typescript
import { retry } from './utils/retry';

const result = await retry(
  async () => await apiCall(),
  {
    maxAttempts: 3,
    initialDelay: 1000,
    name: 'api-call',
  }
);
```

## Best Practices

1. **Use descriptive names** for circuit breakers and retry operations for better logging
2. **Configure thresholds** based on your service's characteristics
3. **Combine patterns** - use circuit breakers with retry logic for maximum resilience
4. **Monitor logs** to understand circuit breaker state changes and retry patterns
5. **Test failure scenarios** to ensure your resilience patterns work as expected

## Learning Resources

- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Google SRE Book - Handling Overload](https://sre.google/sre-book/handling-overload/)

## Support

For questions about these examples or the enterprise capabilities:
1. Refer to the main [ENTERPRISE_CAPABILITIES.md](../../ENTERPRISE_CAPABILITIES.md) documentation
2. Check the inline comments in the example files
3. Review the source code in `src/utils/`
