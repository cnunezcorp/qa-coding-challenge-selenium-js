/**
 * Enum que representa los colores disponibles.
 *
 * <p>Cada color contiene su codigo hexadecimal que se utiliza
 * para aplicar el estilo al texto.</p>
 *
 * @author Cristofer Nuñez
 * @version 1.0
 */
class Color {
    static ROJO = new Color('#cc0000');
    static AZUL = new Color('#0000cc');
    static VERDE = new Color('#00cc00');
    static AMARILLO = new Color('#cccc00');
    static NEGRO = new Color('#000000');

    constructor(codigoHex) {
        this.codigoHex = codigoHex;
    }

    getCodigoHex() {
        return this.codigoHex;
    }

    static valueOf(name) {
        const upperName = name.toUpperCase();
        switch (upperName) {
            case 'ROJO':
                return Color.ROJO;
            case 'AZUL':
                return Color.AZUL;
            case 'VERDE':
                return Color.VERDE;
            case 'AMARILLO':
                return Color.AMARILLO;
            case 'NEGRO':
                return Color.NEGRO;
            default:
                return Color.ROJO;
        }
    }
}

module.exports = Color;

