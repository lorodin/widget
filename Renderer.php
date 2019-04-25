<?php

namespace Widget;

use App\IWidgetRenderResult;


class TestRenderer implements IWidgetRenderResult{

    function __construct($html){
        $this->html = $html;
    }

    public function getHTMLCode(): string{
        return $this->html;
    }

    public function getCSSCode(): string{
        return "";
    }

    public function getJSCode(): string{
        return "";
    }

    public function getCSSFiles(): array{
        return array(
            "https://use.fontawesome.com/releases/v5.8.1/css/all.css",
            "/widget/css/widget.calendar.css"
        );
    }

    public function getJSFiles(): array{
        return array(
            "/widget/js/widget.calendar.js"
        );
    }
}