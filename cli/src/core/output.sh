#!/bin/sh

: "${ORB_LOGS:=false}"

orb_stdout_is_tty() {
  command -v tty >/dev/null 2>&1 && tty -s <&1 2>/dev/null
}

if [ "${NO_COLOR+x}" != x ] && { [ "${ORB_FORCE_COLOR:-0}" = 1 ] || orb_stdout_is_tty; }; then
  ORB_COLOR_YELLOW=$(printf '\033[93m')
  ORB_COLOR_GREEN=$(printf '\033[92m')
  ORB_COLOR_RED=$(printf '\033[91m')
  ORB_COLOR_CYAN=$(printf '\033[96m')
  ORB_COLOR_BLUE=$(printf '\033[94m')
  ORB_COLOR_MAGENTA=$(printf '\033[95m')
  ORB_COLOR_DIM=$(printf '\033[2m')
  ORB_COLOR_RESET=$(printf '\033[0m')
else
  ORB_COLOR_YELLOW=
  ORB_COLOR_GREEN=
  ORB_COLOR_RED=
  ORB_COLOR_CYAN=
  ORB_COLOR_BLUE=
  ORB_COLOR_MAGENTA=
  ORB_COLOR_DIM=
  ORB_COLOR_RESET=
fi

ORB_ICON_SUCCESS='PASS'
ORB_ICON_WARNING='WARN'
ORB_ICON_ERROR='FAIL'
ORB_ICON_INFO='INFO'

orb_print_logo() {
  printf '%s\n' \
    "${ORB_COLOR_CYAN} ██████╗ ██████╗ ██████╗ ${ORB_COLOR_RESET}" \
    "${ORB_COLOR_BLUE}██╔═══██╗██╔══██╗██╔══██╗${ORB_COLOR_RESET}" \
    "${ORB_COLOR_MAGENTA}██║   ██║██████╔╝██████╔╝${ORB_COLOR_RESET}" \
    "${ORB_COLOR_MAGENTA}██║   ██║██╔══██╗██╔══██╗${ORB_COLOR_RESET}" \
    "${ORB_COLOR_BLUE}╚██████╔╝██║  ██║██████╔╝${ORB_COLOR_RESET}" \
    "${ORB_COLOR_CYAN} ╚═════╝ ╚═╝  ╚═╝╚═════╝ ${ORB_COLOR_RESET}"
}

orb_print_success() {
  printf '%s%s  %s%s\n' "$ORB_COLOR_GREEN" "$ORB_ICON_SUCCESS" "$*" "$ORB_COLOR_RESET"
}

orb_print_warning() {
  printf '%s%s  %s%s\n' "$ORB_COLOR_YELLOW" "$ORB_ICON_WARNING" "$*" "$ORB_COLOR_RESET" >&2
}

orb_print_error() {
  printf '%s%s  %s%s\n' "$ORB_COLOR_RED" "$ORB_ICON_ERROR" "$*" "$ORB_COLOR_RESET" >&2
}

orb_print_info() {
  printf '%s%s  %s%s\n' "$ORB_COLOR_CYAN" "$ORB_ICON_INFO" "$*" "$ORB_COLOR_RESET"
}

orb_log() {
  [ "$ORB_LOGS" = true ] || return 0
  printf '%sLOG   %s%s\n' "$ORB_COLOR_DIM" "$*" "$ORB_COLOR_RESET" >&2
}
