# Barcode to Text
Give it an input string and it will output a scannable barcode made entirely of [Block Element characters](https://en.wikipedia.org/wiki/Block_Elements)

```
                        █▐▁▌▁▐█▁▌▐▌█▁▌▁▐▐▐█▁▐▌█▁▐█▐▐▌
```

## [Create your own!](https://505e06b2.github.io/Barcode-to-Text/)

## Recommended Scanners
- ### Android
    - [QR & Barcode Scanner (F-Droid)](https://f-droid.org/en/packages/com.example.barcodescanner/)
        - Supports directly scanning Dark-mode barcodes (white on black), though may be a bit fiddly
        - May have issues loading images from gallery (tested on Android 11)
    - [Binary Eye (F-Droid)](https://f-droid.org/en/packages/de.markusfisch.android.binaryeye/)
- ### Desktop
    - [zbar](https://github.com/mchehab/zbar)

## Implemented Barcode Symbologies
- ### Interleaved 2 of 5 (ITF)
    - Pros
        - Small barcode size
    - Cons
        - No error checking, which can occasionally lead to misinterpreted scans
        - Can only encode digits
        - Input length must be a multiple of 2
        - Scanners may not accept data that is less than 6 digits (ITF-6)
- ### Code 128
    - Pros
        - Can encode any printable 7-bit ASCII character
        - Error checking
    - Cons
        - Barcodes can become rather long
    - **Optimisation Hints**
        - If input is entirely made of digits, the encoder employs a system similar to ITF, but with error checking and allowing odd input lengths
        - If 4 or more digits (in multiples of 2) are encountered, the last digit adds no length to the barcode
