package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.generators.QRGenerator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@CrossOrigin("https://www.aukhtubut.com/*")
@RestController
@RequestMapping("/api/v1/generators")
public class GeneratorsController {

    @GetMapping(value = "/{code}")
    public ResponseEntity<byte[]> genQrCode(@PathVariable("code") String code)
            throws Exception {
        //return okResponse(QRGenBarcodeGenerator.generateQRCodeImage(code));

        // Create or fetch your BufferedImage
        BufferedImage image = QRGenerator.generateQRCodeImage(code);

        // Convert BufferedImage to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "jpg", baos);
        byte[] imageInByte = baos.toByteArray();

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);

        // Return the image, headers, and status
        return new ResponseEntity<>(imageInByte, headers, HttpStatus.OK);
    }

    private ResponseEntity<BufferedImage> okResponse(BufferedImage image) {
        return new ResponseEntity<BufferedImage>(image, HttpStatus.OK);
    }
}