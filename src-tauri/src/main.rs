#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::ExitCode;

fn main() -> ExitCode {
    nh_reader_lib::run();
    ExitCode::SUCCESS
}