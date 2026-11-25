-- Part III(a): FSM, modified from Lab 5.
-- Lab 5 visited the states as 0,8,6,4,2,7,5,3,1. Lab 6 needs a plain
-- up-counter 0 -> 1 -> ... -> 8 -> 0 so the ALU runs Table 1 in order.
-- reset is ACTIVE-HIGH (same as Lab 5). The FSM only advances while data_in = '1'.
-- student_id is now Moore-style: state k shows the k-th digit of the student ID.
library ieee;
use ieee.std_logic_1164.all;

entity fsm is
  port (
    clk, data_in, reset : in  std_logic;
    student_id    : out std_logic_vector(3 downto 0);
    current_state : out std_logic_vector(3 downto 0));
end entity;

architecture behavior of fsm is
  type state_type is (s0, s1, s2, s3, s4, s5, s6, s7, s8);
  signal yfsm : state_type;
begin
  -- next-state logic: count up
  process (clk, reset)
  begin
    if reset = '1' then
      yfsm <= s0;
    elsif (clk'event and clk = '1') then
      if data_in = '1' then
        case yfsm is
          when s0 => yfsm <= s1;
          when s1 => yfsm <= s2;
          when s2 => yfsm <= s3;
          when s3 => yfsm <= s4;
          when s4 => yfsm <= s5;
          when s5 => yfsm <= s6;
          when s6 => yfsm <= s7;
          when s7 => yfsm <= s8;
          when s8 => yfsm <= s0;
        end case;
      end if;
    end if;
  end process;

  -- outputs: state number + one student-ID digit per state
  -- (digits are 5 0 1 3 5 6 4 3 9, the same ID the Lab 5 FSM showed)
  process (yfsm)
  begin
    case yfsm is
      when s0 => current_state <= "0000"; student_id <= "0101"; -- 5
      when s1 => current_state <= "0001"; student_id <= "0000"; -- 0
      when s2 => current_state <= "0010"; student_id <= "0001"; -- 1
      when s3 => current_state <= "0011"; student_id <= "0011"; -- 3
      when s4 => current_state <= "0100"; student_id <= "0101"; -- 5
      when s5 => current_state <= "0101"; student_id <= "0110"; -- 6
      when s6 => current_state <= "0110"; student_id <= "0100"; -- 4
      when s7 => current_state <= "0111"; student_id <= "0011"; -- 3
      when s8 => current_state <= "1000"; student_id <= "1001"; -- 9
    end case;
  end process;
end architecture;
