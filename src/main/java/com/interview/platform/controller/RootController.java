package com.interview.platform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.Map;

@Controller
public class RootController {

    @RequestMapping(value = { "/", "/{path:[^\\.]*}", "/**/{path:[^\\.]*}" })
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping("/api/v1/health")
    @ResponseBody
    public Map<String, String> health() {
        return Map.of("status", "UP", "message", "SmartPrep AI is running");
    }
}
