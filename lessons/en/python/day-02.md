---
title: "Day 2: Variables & Basic Data Types"
description: "Understand variables, constants, dynamic typing, and primitive data types in Python. Solve a temperature converter challenge."
codingExercise: true
initialCode: |
  def c_to_f(celsius):
      # Complete the function to convert Celsius to Fahrenheit
      # Formula: (Celsius * 9/5) + 32
      fahrenheit = None
      return fahrenheit
testCode: |
  assert c_to_f(0) == 32, "0°C should convert to 32°F"
  assert c_to_f(100) == 212, "100°C should convert to 212°F"
  assert c_to_f(-40) == -40, "-40°C should convert to -40°F"
  assert c_to_f(37) == 98.6, "37°C should convert to 98.6°F"
solutionCode: |
  def c_to_f(celsius):
      fahrenheit = (celsius * 9/5) + 32
      return fahrenheit
---

# Day 2: Variables & Basic Data Types

In Python, variables are dynamically typed. This means you don't need to declare their type explicitly.

## Basic Data Types
- **int**: Whole numbers (e.g., `x = 10`)
- **float**: Decimals (e.g., `y = 3.14`)
- **str**: Text values (e.g., `name = "Python"`)
- **bool**: True/False values (e.g., `is_active = True`)

## Challenge

Complete the `c_to_f(celsius)` function in the editor to convert a given Celsius temperature into Fahrenheit.
