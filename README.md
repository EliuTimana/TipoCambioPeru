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

### Requerimientos
- PHP 7.1 o superior.
- Extensión `curl`

### Servicios Disponibles
- Consulta de tipo de cambio
