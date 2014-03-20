<?php

switch (substr($_GET['image'], -3)) {
    case 'jpg':
        $mime = 'image/jpg';
        $img_src = imagecreatefromjpeg($_GET['image']);
        break;
    case 'gif':
        $mime = 'image/gif';
        $img_src = imagecreatefromgif($_GET['image']);
        break;
    case 'png':
        $mime = 'image/png';
        $img_src = imagecreatefrompng($_GET['image']);
        break;
    default:
        die();
}

header('Content-type: ' . $mime);
$size = imagesy($img_src);
$img_dst = imagecreatetruecolor(64, 64);
imagecopyresampled($img_dst, $img_src, 0, 0, $_GET['subtex'] * $size, 0, 64, 64, $size, $size);
imagepng($img_dst);

?>
