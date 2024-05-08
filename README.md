# TipoCambioPeru
Librería para obtener el tipo de cambio de SUNAT - Perú

## Instalación
Usando composer desde [packagist.org](https://packagist.org/packages/eliu-timana/tipo-cambio-peru)
```bash
composer require eliu-timana/tipo-cambio-peru
```

## Uso
```php
use TipoCambioPeru;

require 'vendor/autoload.php';

$factory = new TipoCambio();
$cs = $factory->create();

$result = $cs->get();
if (!$result) {
    echo 'Not found';
    return;
}

echo json_encode($result);
```

## Result (json)
```json
{
  "rate": 3.751,
  "sunat": 3.76,
  "bcp": 3.842,
  "interbank": 3.7495,
  "bn": 3.810
}
```

### Requerimientos
- PHP 7.1 o superior.
- Extensión `curl`

### Servicios Disponibles
- Consulta de tipo de cambio
